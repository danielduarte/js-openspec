import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import StringSpec from "../../../../src/OpenSpec/Spec/Type/StringSpec";
import TypeSpec from "../../../../src/OpenSpec/Spec/Type/TypeSpec";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = { type: 'string' };
    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}
function getValidValueInstance()
{
    return 'a testing string';
}

function getInvalidValueInstance()
{
    return 54321;
}


describe('StringValidationTest', function() {

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
