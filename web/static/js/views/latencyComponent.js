(() => {
  'use strict';

  class LatencyComponentController {
  }

  angular.module('chat').component('latencyComponent', {
    template: `<h3 class="text-right">{{$ctrl.elapsedTime}}s</h3>`,
    controller: LatencyComponentController,
    bindings: {
      elapsedTime: '<'
    }
  });
})();
