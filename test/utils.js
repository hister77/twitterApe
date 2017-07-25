const assert = require('assert');
const util = require('./../lib/utils');
const _ = require('lodash');

describe('util', function() {
  describe('#arrify()', function() {
    
    let data = [
      { name: '#ThankYouForPurposeTour' },
      { name: '#HashHash' },
      { name: '##hashTag' },
      { name: '#Donk' },
      { name: '#Plump' },
      { name: '#ThankYouForPurposeTour' }
    ];

    it('should remove hash if its the first character', function() {
      assert.deepEqual(["ThankYouForPurposeTour", "HashHash", "#hashTag", "Donk", "Plump"], util.default.arrify(data));
    });
    
    it('should prin name vales into the array', function() {
      assert.deepEqual(["#ThankYouForPurposeTour", "#HashHash", "##hashTag", "#Donk", "#Plump"], util.default.arrify(data, true));
    });
 
  });

  describe("", function() {
    
    let data = [
      { name: '' }
    ];
    
    it('should return an array with empty string', function() {
      assert.deepEqual([ "" ], util.default.arrify(data, true));
    });
   
  });

});
