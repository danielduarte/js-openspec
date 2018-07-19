class SpecLibraryException extends Error
{
}

// @todo review these answer and the following line
// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript#answer-43595019
SpecLibraryException.prototype = Error.prototype;


export default SpecLibraryException;
