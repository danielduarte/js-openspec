import ParseSpecException from "../ParseSpecException";


class Spec
{
    constructor() {
        this._library = null;
    }

    getSpecLibrary()
    {
        return this._library;
    }

    validate(value, throwExceptionOnInvalid = false)
    {
        let errors = [];

        try {

            this.parse(value);

        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            if (throwExceptionOnInvalid) {
                throw ex;
            }

            errors = ex._errors; // @todo use ->getErrors();
        }

        return errors.length === 0;
    }
}


export default Spec;
