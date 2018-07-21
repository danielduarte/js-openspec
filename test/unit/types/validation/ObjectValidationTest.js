import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = {
        'type': 'object',
        'fields': {
            'name': {'type': 'string'},
            'happy': {'type': 'boolean'},
        }
    };

    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}

function getValidValueInstance()
{
    return {
        'name': 'Daniel',
        'happy': true
    };
}

function getInvalidValueInstance()
{
    return {
        'name': 'Daniel',
        'happy': 'yes'
    };
}


describe('ObjectValidationTest', function() {

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

    it('testExtensionFieldSpec', function() {
        let specData = {
            'type': 'object',
            'extensible': true,
            'fields': {
                'name': {'type': 'string'},
                'happy': {'type': 'boolean'},
            },
            'extensionFields': {
                'type': 'mixed',
                'options': [
                    {'type': 'boolean'},
                    {'type': 'string'}
                ]

            }
        };

        let value = {
            'new-field-1': true,
            'new-field-2': false,
            'new-field-3': 'something',
        };

        let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

        let result = spec.validate(value);
        assert(result, "Given value not recognized by the spec, even when it should.");
    });

    it('testValidValueWithNumericStringKeys', function() {
        let specData = {
            'type': 'object',
            'fields': {
                '200': {'type': 'boolean'},
                'hello': {'type': 'boolean'},
                '400': {'type': 'boolean'},
            }
        };
        let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

        let value = {
            '200': true,
            'hello': true,
            '400': true,
        };

        let result = spec.validate(value);

        assert(result, "Given value not recognized by the spec, even when it should.");
    });

    it('testEmptyObjectValueWithFieldSpecs', function() {
        let specData = {
            'type': 'object',
            'fields': {
                'field1': {'type': 'string'},
                'field2': {'type': 'null'}
            }
        };

        let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

        let value =  {};

        let result = spec.validate(value);

        assert(result, "Empty object value not recognized, even when it should.");
    });

    it('testEmptyObjectValue', function() {
        let specData = {'type'  : 'object'};
        let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

        let value =  {};

        let result = spec.validate(value);

        assert(result, "Empty object value not recognized, even when it should.");
    });

    it('testObjectValueWithNoFieldSpecs', function() {
        let specData = {'type'  : 'object', 'extensible' : true};
        let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

        let value = {
            'field1': true,
            'field2': null,
            'field3': 9876,
        };

        let result = spec.validate(value);

        assert(result, "Given value not recognized by the object spec without field specs, even when it should.");
    });

});
