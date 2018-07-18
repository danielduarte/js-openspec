import assert from 'assert';
import SpecBuilder        from '../../../src/OpenSpec/SpecBuilder'
import ParseSpecException from '../../../src/OpenSpec/ParseSpecException';
import SpecLibrary        from '../../../src/OpenSpec/SpecLibrary';


describe('GeneralTypeParsingTest', function() {

    it('testParseInvalidDataSpecError', function() {

        assert.throws(function() {
            let specData = 123456;
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        }, function(err) {
            if ((err instanceof ParseSpecException) && err.code === ParseSpecException.CODE_ARRAY_EXPECTED) {
                return true;
            }
        }, "Unexpected error");

    });

    it('testParseInvalidTypeOfTypeSpecError', function() {

        assert.throws(function() {
            let specData = { type: true };
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        }, function(err) {
            if ((err instanceof ParseSpecException) && err.code === ParseSpecException.CODE_INVALID_TYPE_NAME_TYPE) {
                return true;
            }
        }, "Unexpected error");

    });

    it('testParseUnknownTypeSpecError', function() {

        assert.throws(function() {
            let specData = { type: 'any_weird_string' };
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        }, function(err) {
            if ((err instanceof ParseSpecException) && err.code === ParseSpecException.CODE_UNKNOWN_SPEC_TYPE) {
                return true;
            }
        }, "Unexpected error");

    });

});
