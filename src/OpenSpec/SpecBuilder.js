//import ParseSpecException from './ OpenSpec\Spec\Type\TypeSpec;

import NullSpec           from './Spec/Type/NullSpec';
import BooleanSpec        from './Spec/Type/BooleanSpec';
import StringSpec         from './Spec/Type/StringSpec';
import IntegerSpec        from './Spec/Type/IntegerSpec';
import FloatSpec          from './Spec/Type/FloatSpec';
import ObjectSpec         from './Spec/Type/ObjectSpec';
import ArraySpec          from './Spec/Type/ArraySpec';
import MixedSpec          from './Spec/Type/MixedSpec';
import RefSpec            from './Spec/Type/RefSpec';
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
            'null'    : NullSpec,
            'boolean' : BooleanSpec,
            'string'  : StringSpec,
            'integer' : IntegerSpec,
            'float'   : FloatSpec,
            'object'  : ObjectSpec,
            'array'   : ArraySpec,
            'mixed'   : MixedSpec,
            'ref'     : RefSpec,
        };

        if (!classMap.hasOwnProperty(type)) {
            throw new ParseSpecException("Unknown spec type 'type'.", ParseSpecException.CODE_UNKNOWN_SPEC_TYPE);
        }

        let specClassName = classMap[type];

        return new specClassName(specData, library);
    }
}


export default SpecBuilder;
