const target = (name, _semver) => {
  if (name === '@types/node') {
    return 'minor'
  }
  return 'latest'
}

exports.target = target
