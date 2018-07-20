import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import ArraySpec from "../../../../src/OpenSpec/Spec/Type/ArraySpec";
import TypeSpec from "../../../../src/OpenSpec/Spec/Type/TypeSpec";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";
import FloatSpec from "../../../../src/OpenSpec/Spec/Type/FloatSpec";


function getSpecInstance()
{
    let specData = { type: 'array', items: { type: 'string' } };
    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}

// @todo find a better way to compare arrays
const equal_arrays = function(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!equal_arrays(array1[i], array2[i])) {
                return false;
            }
        } else if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
};

function array_unique(array) {
    return array.filter((elem, index, array) => { return array.indexOf(elem) === index; });
}


describe('ArrayParsingTest', function() {

    it('testParseSpecResult', function() {
        let spec = getSpecInstance();

        assert(spec instanceof ArraySpec);
    });

    it('testSpecCorrectTypeName', function() {
        let spec = getSpecInstance();

        assert(spec.getTypeName() === 'array');
    });

    it('testSpecRequiredFields', function() {
        let spec = getSpecInstance();

        let fields = spec.getRequiredFields();
        fields.sort();
        assert(equal_arrays(fields, ['type']));
    });

    it('testSpecOptionalFields', function() {
        let spec = getSpecInstance();

        let fields = spec.getOptionalFields();
        fields.sort();
        assert(equal_arrays(fields, ['items']));
    });

    it('testSpecAllFields', function() {
        let spec = getSpecInstance();

        let reqFields = spec.getRequiredFields();
        let optFields = spec.getOptionalFields();
        let allFieldsCalculated = array_unique([...reqFields, ...optFields]);
        allFieldsCalculated.sort();

        let allFields = spec.getAllFields();
        allFields.sort();

        assert(equal_arrays(allFieldsCalculated, allFields));
    });

    it('testUnexpectedFields', function() {
        let specData = {
            type:                        'array',
            this_is_an_unexpected_field: 1234,
            and_this_is_other:           ['a', 'b']
        };

        let exception = null;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            exception = ex;
        }

        assert(exception.containsError(ParseSpecException.CODE_UNEXPECTED_FIELDS));
    });

    it('testFieldItemsOfInvalidType', function() {
        let specData = { type: 'array', items: 'this is a string' };

        let exception = null;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            exception = ex;
        }

        assert(exception.containsError(ParseSpecException.CODE_ARRAY_EXPECTED));
    });

    it('testValidArrayOfAny', function() {
        let specData = { type: 'array' };

        let errors;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
            errors = [];
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            errors = ex._errors; // @todo getErrors();
        }

        assert(errors.length === 0, "Spec for array of any element not validates as expected.");
    });

});
