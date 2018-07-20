//use OpenSpec\ParseSpecException;


class IntegerSpec //extends TypeSpec
{/*
    public function getTypeName(): string
    {
        return 'integer';
    }

    public function getRequiredFields(): array
    {
        return ['type'];
    }

    public function getOptionalFields(): array
    {
        return [];
    }
*/
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
