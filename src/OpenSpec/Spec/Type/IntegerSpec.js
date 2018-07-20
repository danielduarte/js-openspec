import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";


class IntegerSpec extends TypeSpec
{
    // @todo implement this default empty method in parent
    _initValues() {
    }

    getTypeName()
    {
        return 'integer';
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

        if (!Number.isInteger(value)) {
            errors.push([ParseSpecException.CODE_INTEGER_EXPECTED, "Expected integer value for 'integer' type spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        return value;
    }
}


export default IntegerSpec;
