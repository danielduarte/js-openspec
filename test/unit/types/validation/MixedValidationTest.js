import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = {
        'type': 'mixed',
        'options': [
            {'type': 'string'},
            {'type': 'boolean'}
        ]
    };

    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}

function getValidValueInstance()
{
    return 'a string';
}

function getInvalidValueInstance()
{
    return [false, 'a string', 12345, true, false, 'another string'];
}


describe('MixedValidationTest', function() {

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
