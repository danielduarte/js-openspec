import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import ObjectSpec from "../../../../src/OpenSpec/Spec/Type/ObjectSpec";
import TypeSpec from "../../../../src/OpenSpec/Spec/Type/TypeSpec";
import ParseSpecException from "../../../../src/OpenSpec/ParseSpecException";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = {
        type: 'object',
        fields: {
            field1: { type: 'string' },
            field2: { type: 'string' },
        },
        requiredFields: [ 'field1' ],
        extensible: true
    };

    return SpecBuilder.getInstance().build(specData, new SpecLibrary());
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


describe('ObjectParsingTest', function() {

    it('testParseSpecResult', function() {
        let spec = getSpecInstance();
        assert(spec instanceof ObjectSpec);
    });

    it('testSpecCorrectTypeName', function() {
        let spec = getSpecInstance();
        assert(spec.getTypeName() === 'object');
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
        assert(equal_arrays(fields, ['extensible', 'extensionFields', 'fields', 'requiredFields']));
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
            type:                        'object',
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

    it('testFieldFieldsOfInvalidType', function() {
        let specData = { type: 'object', fields: 'this is a string' };

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

    it('testFieldRequiredFieldsOfInvalidType', function() {
        let specData = { type: 'object', fields: [], requiredFields: 'An array should be here' };

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

    it('testFieldRequiredFieldsWithInvalidItems', function() {
        let specData = { type: 'object', fields: [], requiredFields: ['correct1', 'correct2', 1234, 'correct3'] };

        let exception = null;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            exception = ex;
        }

        assert(exception.containsError(ParseSpecException.CODE_STRING_EXPECTED));
    });

    it('testFieldExtensibleOfInvalidType', function() {
        let specData = { type: 'object', extensible: 'this is a string' };

        let exception = null;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            exception = ex;
        }

        assert(exception.containsError(ParseSpecException.CODE_INVALID_SPEC_DATA));
    });

    it('testFieldExtensionFieldsOfInvalidType', function() {
        let specData = { type: 'object', extensible: true, extensionFields: 'this is a string' };

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

    it('testExtensionFieldsWithoutExtensible', function() {
        let specData = { type: 'object', extensionFields: { type: 'string' } };

        let exception = null;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            exception = ex;
        }

        assert(exception.containsError(ParseSpecException.CODE_EXTENSIBLE_EXPECTED));
    });

    it('testExtensionFieldsWithExtensibleFalse', function() {
        let specData = { type: 'object', extensible: false, extensionFields: { type: 'string' } };

        let exception = null;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            exception = ex;
        }

        assert(exception.containsError(ParseSpecException.CODE_EXTENSIBLE_EXPECTED));
    });

    it('testValidObjectWithNoFieldSpecs', function() {
        let specData = { type: 'object' };

        let errors;
        try {
            SpecBuilder.getInstance().build(specData, new SpecLibrary());
            errors = [];
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            errors = ex._errors; // @todo ->getErrors();
        }

        assert(errors.length === 0, "Spec for object with no field specs not validates as expected.");
    });

});
