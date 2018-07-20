import assert from 'assert';

import ParseSpecException from '../../../src/OpenSpec/ParseSpecException';
import OpenSpec           from '../../../src/OpenSpec/Spec/OpenSpec';


describe('SpecParsingTest', function() {

    it('testParseValidSpec', function() {

        let specData = {
            openspec: '1.0.6',
            name:     'The Name',
            version:  '1.0.0',
            spec:     { type: 'string' }
        };

        let errorMsg = null;
        try {
            new OpenSpec(specData);
        } catch (err) {

            if (!(err instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            errorMsg = err.message;
        }

        assert(errorMsg === null, "Error trying to parse valid spec: \n" + errorMsg);
    });

    it('testParseNotValidSpec', function() {

        let specData = {
            name:    'The Name',
            version: '1.0.0',
            spec:    { type: 'string' }
        };

        let exception = null;
        try {
            new OpenSpec(specData);
        } catch (err) {

            if (!(err instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }
            exception = err;
        }

        assert(exception !== null && exception.containsError(ParseSpecException.CODE_MISSING_REQUIRED_FIELD), "Expected 'missing required field' error trying to parse invalid spec, but no error occurred.");
    });

});
