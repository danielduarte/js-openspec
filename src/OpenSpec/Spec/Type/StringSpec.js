import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";


class StringSpec extends TypeSpec
{
    _initValues() {
    }

    getTypeName()
    {
        return 'string';
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

        if (typeof value !== 'string') {
            errors.push([ParseSpecException.CODE_STRING_EXPECTED, "Expected string value for 'string' type spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        return value;
    }
}


export default StringSpec;
