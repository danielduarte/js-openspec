import assert from 'assert';

import SpecBuilder from "../../../../src/OpenSpec/SpecBuilder";
import SpecLibrary from "../../../../src/OpenSpec/SpecLibrary";


function getSpecInstance()
{
    let specData = { type: 'array', items: { type: 'string' } };
    let spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());

    return spec;
}

function getValidValueInstance()
{
    return ['one', 'two', 'three'];
}

function getInvalidValueInstance()
{
    return [1, 2, 3];
}

describe('ArrayValidationTest', function() {

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

    it('testSeveralValidations', function() {

        let specData, value, spec, result;

        // 1 ------------------------------------------------
        specData  = {
            'type': 'array',
            'items': {
                'type': 'array',
                'items': {
                    'type': 'mixed',
                    'options': [
                        {'type':'string'},
                        {'type':'boolean'}
                    ]
                }
            }
        };

        value = [
            [true, false, true],
            ['string', 'value', false],
            [],
            ['other', 'another one']
        ];

        spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());
        result = spec.validate(value);

        assert(result, "Not validated array of arrays of string|boolean.");
        // End: 1 ------------------------------------------------

        // 2 ------------------------------------------------
        specData  = {
            'type': 'object',
            'extensible': true,
            'fields': {
                'name': {'type': 'string'},
                'happy': {'type': 'boolean'},
                'age': {'type': 'string'},
                'hobbies': {
                    'type': 'array',
                    'items': {
                        'type': 'string'
                    }
                },
                'address': {
                    'type': 'object',
                    'fields': {
                        'country': {'type': 'string'},
                        'city': {'type': 'string'},
                        'phones': {'type': 'array', 'items': {'type': 'string'}},
                    }
                },
            }
        };

        value = {
            'name': 'Daniel',
            'happy': true,
            'age': '37',
            'hobbies': ['numismatics', 'rubik cubes'],
            'address': {
                'country': 'Argentina',
                'city': 'Tandil',
                'phones': []
            },
            'comments': ''
        };

        spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());
        result = spec.validate(value);

        assert(result, "Not validated person info.");
        // End: 2 ------------------------------------------------

        // 3 ------------------------------------------------
        specData  = {'type'  : 'array'};
        let values = [
            [], // Empty array
            [false, true, true], // Boolean array
            ["hello", "bye"], // String array
            [null, null, null], // Null array
            [{'name' : 'Daniel', 'alias' : 'Dani'}, {'a': 1, 'b': [2, 3]}], // Object array
            [[], {'field' : 'value'}, [null, false, "hi!"]], // Array of arrays (bidimensional array / matrix)
        ];

        spec = SpecBuilder.getInstance().build(specData, new SpecLibrary());
        for (let i = 0; i < values.length; i++) {
            let value = values[i];

            result = spec.validate(value);
            assert(result, "Not validated array.");
        }

        let complexValue = values;
        result = spec.validate(complexValue);
        assert(result, "Not validated array of any type of items.");
        // End: 3 ------------------------------------------------
    });

});
