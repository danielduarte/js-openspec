import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import TypeSpec from "../../../../src/OpenSpec/Spec/Type/TypeSpec";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let library = new SpecLibrary();

    let refSpecData = {
        type: 'ref',
        spec: 'Link'
    };
    let refSpec = SpecBuilder.getInstance().build(refSpecData, library);

    if (!library.hasSpec('Link')) {
        let specData = {
            type: 'object',
            fields: {
                title: { type: 'string' },
                url:   { type: 'string' }
            }
        };
        library.registerSpecFromData('Link', specData);
    }

    return refSpec;
}

function getValidValueInstance()
{
    return {
        title: 'Go to Google',
        url: 'http://google.com'
    };
}

function getInvalidValueInstance()
{
    return {
        title: null,
        url: 'http://google.com'
    };
}


describe('RefValidationTest', function() {

    it('testValidValue', function() {
        let spec  = getSpecInstance();
        let value = getValidValueInstance();

        let result = spec.validate(value);

        assert(result, "Given value not recognized by the spec, even when it should.");
    });

    it('testInvalidValue', function() {
        let spec  = getSpecInstance();
        let value = getInvalidValueInstance();

        let result = spec.validate(value);

        assert(!result, "Given value recognized by the spec, even when it should not.");
    });

});
