import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = { type: 'float' };
    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}

function getValidValueInstance()
{
    return 3.14159265359;
}

function getInvalidValueInstance()
{
    return 3;
}


describe('FloatValidationTest', function() {

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
