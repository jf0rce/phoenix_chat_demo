(() => {
  'use strict';

  class ChatComponentController {
    constructor($window, $interval, $scope) {
      this.phoenix = require("phoenix");
      this.socket = new this.phoenix.Socket("/socket");
      this.$window = $window;
      this.$interval = $interval;
      this.$scope = $scope;
    }

    $onInit() {
      this.roomId = Math.floor(Math.random() * 100);
      this.message = '';
      this.messages = [];
      this.elapsedTime = 0;
      this.userId = `user_${Math.floor(Math.random() * 100)}`;
      this.establishConnection();
      this.room.on("new_message", this.appendMessage.bind(this));
    }

    appendMessage(msg) {
      this.messages.push(msg)
      this.$scope.$apply();
    }

    establishConnection() {
      this.socket.connect();
      this.room = this.socket.channel(`room:${this.roomId}`);

      this.room.join()
        .receive("ok", resp => console.log(`joined room ${this.roomId}`, resp) )
        .receive("error", reason => console.log(`failed to join room ${this.roomId}`, reason) )
        .receive("timeout", () => console.log(`timeout joining room ${this.roomId}`) )
    }

    sendMessage() {
      let now = () => {
        return (new Date()).getTime();
      }

      let startTimer = () => {
        let startedAt = now();
        let promise = this.$interval(() => {
          let elapsed = (now() - startedAt) / 1000;
          this.elapsedTime = `${elapsed}s`
        }, 100);
        return {promise, startedAt}
      }

      let stopTimer = ({promise, startedAt}) => {
        this.$interval.cancel(promise);
        this.elapsedTime = `${(now() - startedAt) / 1000}`
      }

      let promise = startTimer();
      
      this.room.push("publish_message", {username: this.userId, body: this.message})
        .receive("ok", resp => {
          this.message = '';
          stopTimer(promise);
          this.$scope.$apply();
        })
        .receive("error", resp => alert("publish error") )
        .receive("timeout", resp => alert("timeout error") )
    }
  }

  ChatComponentController.$inject = ['$window', '$interval', '$scope'];

  angular.module('chat').component('chatComponent', {
    template: `<div>
                <latency-component elapsed-time="$ctrl.elapsedTime"></latency-component>
                <ul class="list-unstyled" style="height: 300px; max-height: 300px; overflow: scroll;">
                  <li ng-repeat="message in $ctrl.messages">
                    {{message.username}} says: {{message.body}}
                  </li>
                </ul>
                <div>
                  <h5>Welcome to room {{ $ctrl.roomId}}, {{ $ctrl.userId }}</h5>
                </div>
                <div>
                  <input type="text" ng-model="$ctrl.message" placeholder="Enter a message" style="width: 70%;" />
                  <button ng-click="$ctrl.sendMessage()" ng-disabled="$ctrl.message === ''" style="width: 29%" ng-class="{disabled: $ctrl.message === ''}">Send Message</button>
                </div>
               </div>`,
    controller: ChatComponentController
  });
})();
