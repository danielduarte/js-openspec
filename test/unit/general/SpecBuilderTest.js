import assert from 'assert';

import SpecBuilder        from '../../../src/OpenSpec/SpecBuilder'


describe('GeneralTypeParsingTest', function() {

    it('testCannotCreateSpecBuilder', function() { 

        assert.throws(function() {
            new SpecBuilder();
        }, function(err) {
            if (err instanceof Error) {
                return true;
            }
        }, "Unexpected error");
    });

    it('testSpecBuilderIsSingleton', function() { 
        let builder1 = SpecBuilder.getInstance();
        let builder2 = SpecBuilder.getInstance();

        assert(builder1 instanceof SpecBuilder, 'Expected an instance of SpecBuilder but ' + (typeof builder1) + ' instead.');

        assert(builder1 === builder2, 'Type Spec Builder is not a singleton since more than one instance could be created.');
    
    });

});
