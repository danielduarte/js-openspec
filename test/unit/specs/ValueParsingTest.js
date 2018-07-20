import assert from 'assert';
import mocha from 'mocha/mocha';

import OpenSpec from "../../../src/OpenSpec/Spec/OpenSpec";
import Entity   from "../../../src/OpenSpec/Entity";


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


describe('ValueParsingTest', function() {

    it('testParseValidSimpleSpec', function() {

        let specData = {
            openspec: '1.2.0',
            name:     'Product',
            version:  '1.0.0',
            spec: {
                type: 'object',
                fields: {
                    name:        { type: 'string' },
                    sku:         { type: 'string' },
                    description: { type: 'string' },
                    qty:         { type: 'integer' }
                },
                requiredFields: ['name', 'sku']
            }
        };

        let productSpec = new OpenSpec(specData);

        let product = productSpec.parse({
            name: 'Smart TV',
            sku:  'smart-tv',
            qty:  6
        });

        // @todo Review all tests with assertEquals and assertNotEquals and consider use of assertSame and assertNotSame
        assert('Smart TV' === product.getName());
        assert('smart-tv' === product.getSku());
        assert(6          === product.getQty());
        assert(null       === product.getDescription());
        assert(''         !== product.getDescription());
    });

    it('testParseValidComplexSpec', function() {

        let specData = {
            openspec: '1.2.0',
            name:     'Product',
            version:  '1.0.0',
            spec:     {
                type: 'object',
                fields: {
                    name:        { type: 'string' },
                    sku:         { type: 'string' },
                    description: { type: 'string' },
                    inventory: {
                        type: 'object',
                        fields: {
                            qty: {type: 'integer'},
                            inStock: {type: 'boolean'}
                        },
                        requiredFields: ['qty', 'inStock']
                    }
                },
                requiredFields: ['name', 'sku']
            }
        };

        let productSpec = new OpenSpec(specData);

        let product = productSpec.parse({
            name: 'Smart TV',
            sku:  'smart-tv',
            inventory: {
                qty:     100,
                inStock: true
            }
        });

        assert(100  === product.getInventory().getQty());
        assert(true === product.getInventory().getInStock());
    });

    it('testParseValidArraySpec', function() {

        let specData = {
            openspec: '1.2.0',
            name:     'Collection',
            version:  '1.0.0',
            spec:     {
                type: 'array',
            }
        };

        let productSpec = new OpenSpec(specData);
        let collection;

        // ---- Array 1
        collection = productSpec.parse([1, 2, 3]);
        assert(equal_arrays([1, 2, 3], collection) === true);

        // ---- Array 2
        collection = productSpec.parse([
            { name: 'Dani' },
            { name: 'David' },
            { name: 'Manu' }
        ]);
        assert(3 === collection.length);
        assert('Dani' === collection[0].getName());

        // ---- Array 3
        collection = productSpec.parse([
            3.1415,
            [{ name: 'David' }, 1, 2, true],
            [[[]]],
            { a: { '0': 1, '1': 2, b: { c: [] } }, '0': 'hello' }
        ]);
        assert(4 === collection.length);
        assert(typeof collection[0] === 'number' && !Number.isInteger(collection[0]));
        assert(Array.isArray(collection[1]));
        assert(Array.isArray(collection[2]));
        assert(collection[3] instanceof Entity);
        assert('David' === collection[1][0].getName());
        assert('hello' === collection[3].get0());
    });

});
