(() => {
  'use strict';


  class ChatComponentController {
    constructor($window) {
      this.phoenix = require("phoenix");
      this.socket = new this.phoenix.Socket("/socket");
      this.$window = $window;
      this.elapsedTime = 0;

      this.roomId = 1;
    }

    $onInit() {
      this.establishConnection();
    }

    establishConnection() {
      this.userId = Math.floor(Math.random() + 100);

      this.socket.connect();
      this.room = this.socket.channel(`room:${this.roomId}`);

      this.room.join()
        .receive("ok", resp => console.log(`joined room ${this.roomId}`, resp) )
        .receive("error", reason => console.log(`failed to join room ${this.roomId}`, reason) )
        .receive("timeout", () => console.log(`timeout joining room ${this.roomId}`) )
    }

    now() {
      return (new Date()).getTime();
    }

    sendMessage() {
      const startTimer = () => {
        const startedAt = this.now();
        let timer = setInterval(() => {
          this.elapsedTime = (this.now() - startedAt) / 1000
        }, 100);
        return {timer, startedAt};
      }

      const stopTimer = ({timer, startedAt}) => {
        clearInterval(timer);
        this.elapsedTime = (this.now() - startedAt) / 1000;
      }

      const timer = startTimer()
      this.room.push("publish_message", {username: this.userId, body: this.message}, 120000)
        .receive("ok", resp =>  stopTimer(timer) )
        .receive("error", resp => alert("publish error") )
        .receive("timeout", resp => alert("timeout error") )
    }
  }

  ChatComponentController.$inject = ['$window'];

  angular.module('chat').component('chatComponent', {
    template: `<div>
                <latency-component elapsed-time="$ctrl.elapsedTime"></latency-component>
                <div style="height: 300px; max-height: 300px; overflow: scroll;"></div>
                <div>
                  <input type="text" ng-model="$ctrl.message" placeholder="Enter a message" style="width: 70%;" />
                  <button ng-click="$ctrl.sendMessage()" style="width: 29%">Send Message</button>
                </div>
               </div>`,
    controller: ChatComponentController
  });
})();
