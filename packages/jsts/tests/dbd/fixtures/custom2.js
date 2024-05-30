function foo() {

}

export default {
  dirname(path) {
    return path.toLowerCase();
  }
}

export {foo, foo as bar};