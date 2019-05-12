/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
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

SocketClusterClient.SCClientSocket.prototype._changeToUnauthenticatedStateAndClearTokens = function (fromClient : boolean = false) {
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

//override for decide between client/server unsub channel
SocketClusterClient.SCClientSocket.prototype.unsubscribe = function (channelName) {
    const channel = this.channels[channelName];

    if (channel) {
        if (channel.state !== channel.UNSUBSCRIBED) {
            this._triggerChannelUnsubscribe(channel,undefined,true);
            this._tryUnsubscribe(channel);
        }
    }
};

SocketClusterClient.SCClientSocket.prototype._triggerChannelUnsubscribe = function (channel, newState, fromClient : boolean = false) {
    const channelName = channel.name;
    const oldState = channel.state;

    if (newState) {
        channel.state = newState;
    } else {
        channel.state = channel.UNSUBSCRIBED;
    }
    this._cancelPendingSubscribeCallback(channel);

    if (oldState === channel.SUBSCRIBED) {
        const stateChangeData = {
            channel: channelName,
            oldState: oldState,
            newState: channel.state
        };
        channel.emit('subscribeStateChange', stateChangeData);
        channel.emit('unsubscribe', channelName,fromClient);
        Emitter.prototype.emit.call(this, 'subscribeStateChange', stateChangeData);
        Emitter.prototype.emit.call(this, 'unsubscribe', channelName, fromClient);
    }
};

//override for add feature retrySubForever
SocketClusterClient.SCClientSocket.prototype._triggerChannelSubscribeFail = function (err, channel, subscriptionOptions) {
    const channelName = channel.name;
    const meetsAuthRequirements = !channel.waitForAuth || this.authState === this.AUTHENTICATED;

    if (channel.state !== channel.UNSUBSCRIBED && meetsAuthRequirements) {
        if(!channel.retrySubForever){
            channel.state = channel.UNSUBSCRIBED;
        }
        channel.emit('subscribeFail', err, channelName, subscriptionOptions);
        Emitter.prototype.emit.call(this, 'subscribeFail', err, channelName, subscriptionOptions);
    }
};

SocketClusterClient.SCClientSocket.prototype._privateEventHandlerMap['#kickOut'] = function (data) {
    const undecoratedChannelName = this._undecorateChannelName(data.channel);
    const channel = this.channels[undecoratedChannelName];
    if (channel) {
        Emitter.prototype.emit.call(this, 'kickOut', data.message, undecoratedChannelName);
        channel.emit('kickOut', data.message, undecoratedChannelName);
        if(!channel.retrySubForever){
            this._triggerChannelUnsubscribe(channel);
        }
        else {
            this._triggerChannelUnsubscribe(channel,channel.PENDING);
        }
    }
};

SocketClusterClient.SCClientSocket.prototype._changeToAuthenticatedState = function (signedAuthToken) {
    this.signedAuthToken = signedAuthToken;
    this.authToken = this._extractAuthTokenData(signedAuthToken);

    if (this.authState !== this.AUTHENTICATED) {
        const oldState = this.authState;
        this.authState = this.AUTHENTICATED;
        const stateChangeData = {
            oldState: oldState,
            newState: this.authState,
            signedAuthToken: signedAuthToken,
            authToken: this.authToken
        };
        if (!this.preparingPendingSubscriptions) {
            this.processPendingSubscriptions();
        }

        Emitter.prototype.emit.call(this, 'authStateChange', stateChangeData);
    }
    else {
        this.processPendingSubscriptions();
    }

    Emitter.prototype.emit.call(this, 'authenticate', signedAuthToken);
};

//override for ackTimeout to emit function
SocketClusterClient.SCClientSocket.prototype._emit = function (event, data, callback, ackTimeout) {
    let self = this;

    if (this.state === this.CLOSED) {
        this.connect();
    }
    let eventObject = {
        event: event,
        callback: callback
    };

    let eventNode = new LinkedList.Item();

    if (this.options.cloneData) {
        eventObject['data'] = clone(data);
    } else {
        eventObject['data'] = data;
    }
    eventNode.data = eventObject;

    if(ackTimeout === undefined){
        ackTimeout = this.timeout;
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

SocketClusterClient.SCClientSocket.prototype.emit = function (event, data, callback,ackTimeout) {
    if (this._localEvents[event] == null) {
        this._emit(event, data, callback,ackTimeout);
    } else if (event === 'error') {
        Emitter.prototype.emit.call(this, event, data);
    } else {
        const error = new InvalidActionError('The "' + event + '" event is reserved and cannot be emitted on a client socket');
        this._onSCError(error);
    }
};

export const ModifiedScClient = SocketClusterClient;