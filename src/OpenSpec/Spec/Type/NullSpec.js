import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";


class NullSpec extends TypeSpec
{
    // @todo implement this default empty method in parent
    _initValues() {
    }

    getTypeName()
    {
        return 'null';
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
        errors = [];

        if (value !== null) {
            errors.push([ParseSpecException.CODE_NULL_EXPECTED, "Expected null value for 'null' type spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        return value;
    }
}


export default NullSpec;
