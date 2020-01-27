class Complex{
  constructor(a, b)
  {
    this.re = a
    this.im = b
  }

  add(other)
  {
    return new Complex(this.re + other.re, this.im + other.im)
  }

  mul(other)
  {
    return new Complex(this.re*other.re - this.im*other.im, this.re*other.im + this.im*other.re)
  }
}

function dft(x) {
  let X = []
  const N = x.length

  for (let k = 0; k < N; k++)
  {
    let sum = new Complex(0, 0)
    for (let n = 0; n < N; n++)
    {
      let phi = (TAU*k*n)/N
      let other = new Complex(cos(phi), -sin(phi))
      sum = sum.add( x[n].mul(other) )
    }
    re = sum.re / N
    im = sum.im / N

    let frequency = k
    let amplitude = sqrt(re*re + im*im)
    let phase = atan2(im,re)

    X[k] = {re : re, im : im, frequency: frequency, amplitude: amplitude, phase: phase}
  }
  return X
}
