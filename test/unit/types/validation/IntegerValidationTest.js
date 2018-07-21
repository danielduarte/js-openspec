import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import IntegerSpec from "../../../../src/OpenSpec/Spec/Type/IntegerSpec";
import TypeSpec from "../../../../src/OpenSpec/Spec/Type/TypeSpec";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = { type: 'integer' };
    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}

function getValidValueInstance()
{
    return 456;
}

function getInvalidValueInstance()
{
    return 'this is not an int';
}


describe('IntegerValidationTest', function() {

    // @todo modify similar tests to use validateGetErrors instead of validate
    it('testValidValue', function() {
        let spec  = getSpecInstance();
        let value = getValidValueInstance();

        let errors = [];
        try {
            spec.parse(value);
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            errors = ex._errors; // @todo ->getErrors();
        }

        errors = errors.map(elem => { return elem[1]; });
        let msg = '- ' + errors.join("\n- ");
        assert(errors.length === 0, "Given value not recognized by the spec, even when it should.\n" + msg);
    });

    it('testInvalidValue', function() {
        let spec  = getSpecInstance();
        let value = getInvalidValueInstance();

        let result = spec.validate(value);

        assert(!result, "Given value recognized by the spec, even when it should not.");
    });
});
