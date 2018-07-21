import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import BooleanSpec from "../../../../src/OpenSpec/Spec/Type/BooleanSpec";
import TypeSpec from "../../../../src/OpenSpec/Spec/Type/TypeSpec";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = { type: 'boolean' };
    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}
function getValidValueInstance()
{
    return false;
}

function getInvalidValueInstance()
{
    return 'a string, invalid boolean value';
}


describe('BooleanValidationTest', function() {

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
