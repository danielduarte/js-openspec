/* @todo complete this part of the conversion to JS
namespace OpenSpec;

use OpenSpec\Spec\Type\TypeSpec;
use OpenSpec\Spec\Type\NullSpec;
use OpenSpec\Spec\Type\BooleanSpec;
use OpenSpec\Spec\Type\StringSpec;
use OpenSpec\Spec\Type\IntegerSpec;
use OpenSpec\Spec\Type\FloatSpec;
use OpenSpec\Spec\Type\ObjectSpec;
use OpenSpec\Spec\Type\ArraySpec;
use OpenSpec\Spec\Type\MixedSpec;
use OpenSpec\Spec\Type\RefSpec;
*/
import ParseSpecException from './ParseSpecException';


class SpecBuilder
{
    constructor() {
        if (!SpecBuilder.canCreateInstance) {
            throw new Error('Cannot instantiate SpecBuilder with new. Please use getInstance() instead.');
        }
    }

    static getInstance()
    {
        if (typeof SpecBuilder._instance === 'undefined') {
            // @todo improve this solution for singleton to make sure it is thread-safe and also make sure more instances cannot be created.
            SpecBuilder.canCreateInstance = true;
            SpecBuilder._instance = new SpecBuilder();
            SpecBuilder.canCreateInstance = false;
        }

        return SpecBuilder._instance;
    }

    build(specData, library)
    {
        if (typeof specData !== 'object') {
            throw new ParseSpecException('Expected object as spec data, but ' + (typeof specData) + ' given.', ParseSpecException.CODE_ARRAY_EXPECTED);
        }

        if (!specData.hasOwnProperty('type')) {
            throw new ParseSpecException("Field 'type' not specified in spec data.", ParseSpecException.CODE_MISSING_REQUIRED_FIELD);
        }

        let type = specData.type;
        if (typeof type !== 'string') {
            throw new ParseSpecException("Expected 'type' of spec to be a string value.", ParseSpecException.CODE_INVALID_TYPE_NAME_TYPE);
        }

        let classMap = {
            'null'    : 'NullSpec',
            'boolean' : 'BooleanSpec',
            'string'  : 'StringSpec',
            'integer' : 'IntegerSpec',
            'float'   : 'FloatSpec',
            'object'  : 'ObjectSpec',
            'array'   : 'ArraySpec',
            'mixed'   : 'MixedSpec',
            'ref'     : 'RefSpec',
        };

        if (!classMap.hasOwnProperty(type)) {
            throw new ParseSpecException("Unknown spec type 'type'.", ParseSpecException.CODE_UNKNOWN_SPEC_TYPE);
        }

        let specClassName = classMap[type];

        return new specClassName(specData, library);
    }
}


export default SpecBuilder;
