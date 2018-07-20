import TypeSpec           from "./TypeSpec";
// import ParseSpecException from "../../ParseSpecException";


class FloatSpec //extends TypeSpec
{
    _initValues() {
    }

    getTypeName()
    {
        return 'float';
    }

    getRequiredFields()
    {
        return ['type'];
    }

    getOptionalFields()
    {
        return [];
    }

    parse(value)
    {
        let errors = [];

        if (typeof value !== 'number' || Number.isInteger(value)) {
            errors.push([ParseSpecException.CODE_FLOAT_EXPECTED, "Expected float value for 'float' type spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        return value;
    }
}


export default FloatSpec;
