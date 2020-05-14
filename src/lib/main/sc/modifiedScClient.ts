/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const  Emitter                 = require('component-emitter');
const  SocketClusterClient     = require('socketcluster-client');
const clone                    = require('clone');
const LinkedList               = require('linked-list');
const scErrors                 = require('sc-errors');
const InvalidActionError       = scErrors.InvalidActionError;

//override for decide between client/server deauthenticate
SocketClusterClient.SCClientSocket.prototype.deauthenticate = function (callback) {
    const self = this;
    this.auth.removeToken(this.authTokenName, function (err, oldToken) {
        if (err) {
            // Non-fatal error - Do not close the connection
            self._onSCError(err);
        } else {
            Emitter.prototype.emit.call(self, 'removeAuthToken', oldToken);
            if (self.state !== self.CLOSED) {
                self.emit('#removeAuthToken');
            }
            self._changeToUnauthenticatedStateAndClearTokens(true);
        }
        callback && callback(err);
    });
};

SocketClusterClient.SCClientSocket.prototype._changeToUnauthenticatedStateAndClearTokens = function (fromClient: boolean = false) {
    if (this.authState !== this.UNAUTHENTICATED) {
        const oldState = this.authState;
        const oldSignedToken = this.signedAuthToken;
        this.authState = this.UNAUTHENTICATED;
        this.signedAuthToken = null;
        this.authToken = null;

        const stateChangeData = {
            oldState: oldState,
            newState: this.authState
        };
        Emitter.prototype.emit.call(this, 'authStateChange', stateChangeData);
        Emitter.prototype.emit.call(this, 'deauthenticate', oldSignedToken,fromClient);
    }
};

//override for new timeouts to emit function
SocketClusterClient.SCClientSocket.prototype._emit = function (event, data, callback, ackTimeout) {
    const self = this;

    if (this.state === this.CLOSED) {
        this.connect();
    }
    const eventObject = {
        event: event,
        callback: callback
    };

    const eventNode = new LinkedList.Item();

    if (this.options.cloneData) {
        eventObject['data'] = clone(data);
    } else {
        eventObject['data'] = data;
    }
    eventNode.data = eventObject;

    if(ackTimeout === undefined){
        ackTimeout = this.ackTimeout;
    }
    if(typeof ackTimeout === 'number'){
        eventObject['timeout'] = setTimeout(function () {
            self._handleEventAckTimeout(eventObject, eventNode);
        }, ackTimeout);
    }

    this._emitBuffer.append(eventNode);
    if (this.state === this.OPEN) {
        this._flushEmitBuffer();
    }
};

SocketClusterClient.SCClientSocket.prototype.emit = function (event, data, callback, ackTimeout) {
    if (this._localEvents[event] == null) {
        this._emit(event, data, callback, ackTimeout);
    } else if (event === 'error') {
        Emitter.prototype.emit.call(this, event, data);
    } else {
        const error = new InvalidActionError('The "' + event + '" event is reserved and cannot be emitted on a client socket');
        this._onSCError(error);
    }
};

export const ModifiedScClient = SocketClusterClient;