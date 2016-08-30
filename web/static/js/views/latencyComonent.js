(() => {
  'use strict';

  class LatencyComponentController {
  }

  angular.module('chat').component('latencyComponent', {
    template: `<h3 class="text-right">{{$ctrl.elapsedTime}}s</div>`,
    controller: LatencyComponentController,
    bindings: {
      elapsedTime: '<'
    }
  });
})();
