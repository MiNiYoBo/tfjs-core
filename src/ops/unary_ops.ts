/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {doc} from '../doc';
import {ENV} from '../environment';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util';
import {TensorLike} from '../types';
import * as util from '../util';

import {op} from './operation';
import {scalar, zerosLike} from './tensor_ops';

class UnaryOps {
  /**
   * Computes `-1 * x` element-wise.
   *
   * ```js
   * const x = tf.tensor2d([1, 2, -2, 0], [2, 2]);
   *
   * x.neg().print();  // or tf.neg(x)
   * ```
   *
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static neg<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'neg');

    const grad = (dy: T) => {
      return {$x: () => dy.neg()};
    };
    return ENV.engine.runKernel(backend => backend.neg($x), {$x}, grad);
  }

  /**
   * Computes ceiling of input `Tensor` element-wise: `ceil(x)`
   *
   * ```js
   * const x = tf.tensor1d([.6, 1.1, -3.3]);
   *
   * x.ceil().print();  // or tf.ceil(x)
   * ```
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static ceil<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'ceil');

    // TODO(manrajgrover): Return null for gradients when backprop supports it.
    const grad = (dy: T) => {
      return {$x: () => zerosLike(dy)};
    };
    return ENV.engine.runKernel(backend => backend.ceil($x), {$x}, grad);
  }

  /**
   * Computes floor of input `Tensor` element-wise: `floor(x)`.
   *
   * ```js
   * const x = tf.tensor1d([.6, 1.1, -3.3]);
   *
   * x.floor().print();  // or tf.floor(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static floor<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'floor');

    // TODO(nsthorat): Let gradients be null for cases where we want to stop
    // backpropgation.
    const grad = (dy: T) => {
      return {$x: () => zerosLike(dy)};
    };
    return ENV.engine.runKernel(backend => backend.floor($x), {$x}, grad);
  }

  /**
   * Returns an element-wise indication of the sign of a number.
   *
   * ```js
   * const x = tf.tensor1d([.6, 1.1, -3.3, NaN, 0]);
   *
   * x.sign().print();  // or tf.sign(x)
   * ```
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static sign<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'sign');

    const grad = (dy: T) => {
      return {$x: () => zerosLike(dy)};
    };
    return ENV.engine.runKernel(backend => backend.sign($x), {$x}, grad);
  }

  /**
   * Computes round of input `Tensor` element-wise: `round(x)`.
   * It implements banker's rounding.
   *
   * ```js
   * const x = tf.tensor1d([.6, 1.1, -3.3]);
   *
   * x.round().print();  // or tf.round(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static round<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'round');

    // TODO(nsthorat): Let gradients be null for cases where we want to stop
    // backpropgation.
    const grad = (dy: T) => {
      return {$x: () => zerosLike(dy)};
    };
    return ENV.engine.runKernel(backend => backend.round($x), {$x}, grad);
  }

  /**
   * Computes exponential of the input `Tensor` element-wise. `e ^ x`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, -3]);
   *
   * x.exp().print();  // or tf.exp(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static exp<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'exp');

    const bck = (dy: T, saved: Tensor[]) => {
      const [y] = saved;
      return {$x: () => dy.mulStrict(y as T)};
    };
    return ENV.engine.runKernel(
        (backend, save) => save(backend.exp($x)), {$x}, bck);
  }

  /**
   * Computes exponential of the input `Tensor` minus one element-wise.
   * `e ^ x - 1`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, -3]);
   *
   * x.expm1().print();  // or tf.expm1(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static expm1<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'expm1');

    const grad = (dy: T) => {
      return {$x: () => dy.mulStrict($x.exp())};
    };
    return ENV.engine.runKernel(backend => backend.expm1($x), {$x}, grad);
  }

  /**
   * Computes natural logarithm of the input `Tensor` element-wise: `ln(x)`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, Math.E]);
   *
   * x.log().print();  // or tf.log(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static log<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'log');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict($x.toFloat())};
    };
    return ENV.engine.runKernel(backend => backend.log($x), {$x}, grad);
  }

  /**
   * Computes natural logarithm of the input `Tensor` plus one
   * element-wise: `ln(1 + x)`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, Math.E - 1]);
   *
   * x.log1p().print();  // or tf.log1p(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static log1p<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'log1p');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict($x.add(scalar(1)))};
    };
    return ENV.engine.runKernel(backend => backend.log1p($x), {$x}, grad);
  }

  /**
   * Computes square root of the input `Tensor` element-wise: `y = sqrt(x)`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, 4, -1]);
   *
   * x.sqrt().print();  // or tf.sqrt(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static sqrt<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'sqrt');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict($x.toFloat().sqrt().mul(scalar(2)))};
    };
    return ENV.engine.runKernel(backend => backend.sqrt($x), {$x}, grad);
  }

  /**
   * Computes reciprocal of square root of the input `Tensor` element-wise:
   * `y = 1 / sqrt(x)`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, 4, -1]);
   *
   * x.rsqrt().print();  // or tf.rsqrt(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static rsqrt<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'rsqrt');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict($x.pow(scalar(1.5)).mul(scalar(2))).neg()};
    };
    return ENV.engine.runKernel(backend => backend.rsqrt($x), {$x}, grad);
  }

  /**
   * Computes square of `x` element-wise: `x ^ 2`
   *
   * ```js
   * const x = tf.tensor1d([1, 2, Math.sqrt(2), -1]);
   *
   * x.square().print();  // or tf.square(x)
   * ```
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static square<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'square');

    const grad = (dy: T) => {
      return {$x: () => dy.mulStrict($x.toFloat().mul(scalar(2)))};
    };
    return ENV.engine.runKernel(backend => backend.square($x), {$x}, grad);
  }

  /**
   * Computes reciprocal of x element-wise: `1 / x`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, 2]);
   *
   * x.reciprocal().print();  // or tf.reciprocal(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static reciprocal<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'reciprocal');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict($x.square().neg())};
    };
    return ENV.engine.runKernel(backend => backend.reciprocal($x), {$x}, grad);
  }

  /**
   * Computes absolute value element-wise: `abs(x)`
   *
   * ```js
   * const x = tf.tensor1d([-1, 2, -3, 4]);
   *
   * x.abs().print();  // or tf.abs(x)
   * ```
   * @param x The input `Tensor`.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static abs<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'abs');

    const grad = (dy: T) => {
      return {$x: () => dy.mulStrict($x.toFloat().step(-1))};
    };
    return ENV.engine.runKernel(backend => backend.abs($x), {$x}, grad);
  }

  /**
   * Clips values element-wise. `max(min(x, clipValueMax), clipValueMin)`
   *
   * ```js
   * const x = tf.tensor1d([-1, 2, -3, 4]);
   *
   * x.clipByValue(-2, 3).print();  // or tf.clipByValue(x, -2, 3)
   * ```
   * @param x The input tensor.
   * @param clipValueMin Lower-bound of range to be clipped to.
   * @param clipValueMax Upper-bound of range to be clipped to.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static clipByValue<T extends Tensor>(
      x: T|TensorLike, clipValueMin: number, clipValueMax: number): T {
    const $x = convertToTensor(x, 'x', 'clipByValue');
    util.assert(
        (clipValueMin <= clipValueMax),
        `Error in clip: min (${clipValueMin}) must be ` +
            `less than or equal to max (${clipValueMax}).`);

    const grad = (dy: T) => {
      return {
        $x: () => dy.where(
                      $x.greaterEqual(scalar(clipValueMin))
                          .logicalAnd($x.lessEqual(scalar(clipValueMax))),
                      zerosLike(dy)) as T,
      };
    };
    return ENV.engine.runKernel(
        backend => backend.clip($x, clipValueMin, clipValueMax), {$x}, grad);
  }

  /**
   * Computes sigmoid element-wise, `1 / (1 + exp(-x))`
   *
   * ```js
   * const x = tf.tensor1d([0, -1, 2, -3]);
   *
   * x.sigmoid().print();  // or tf.sigmoid(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static sigmoid<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'sigmoid');

    const grad = (dy: T, saved: Tensor[]) => {
      const [y] = saved;
      return {$x: () => dy.mulStrict(y.mul(scalar(1).sub(y)))};
    };
    return ENV.engine.runKernel(
        (backend, save) => save(backend.sigmoid($x)), {$x}, grad);
  }

  /**
   * Computes log sigmoid of the input `Tensor` element-wise:
   * `logSigmoid(x)`. For numerical stability, we use `-tf.softplus(-x)`.
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.logSigmoid().print();  // or tf.logSigmoid(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static logSigmoid<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'logSigmoid');

    const grad = (dy: T) => {
      return {$x: () => dy.mulStrict($x.neg().sigmoid())};
    };
    return ENV.engine.runKernel(
        backend => backend.softplus($x.neg()).neg(), {$x}, grad);
  }

  /**
   * Computes softplus of the input `Tensor` element-wise: `log(exp(x) + 1)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.softplus().print();  // or tf.softplus(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static softplus<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'softplus');

    const grad = (dy: T) => {
      return {$x: () => dy.mulStrict($x.sigmoid())};
    };
    return ENV.engine.runKernel(backend => backend.softplus($x), {$x}, grad);
  }

  /**
   * Computes sin of the input Tensor element-wise: `sin(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, Math.PI / 2, Math.PI * 3 / 4]);
   *
   * x.sin().print();  // or tf.sin(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static sin<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'sin');

    const grad = (dy: T) => {
      return {$x: () => $x.toFloat().cos().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.sin($x), {$x}, grad);
  }

  /**
   * Computes cos of the input `Tensor` element-wise: `cos(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, Math.PI / 2, Math.PI * 3 / 4]);
   *
   * x.cos().print();  // or tf.cos(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static cos<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'cos');

    const grad = (dy: T) => {
      return {$x: () => $x.toFloat().sin().neg().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.cos($x), {$x}, grad);
  }

  /**
   * Computes tan of the input `Tensor` element-wise, `tan(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, Math.PI / 2, Math.PI * 3 / 4]);
   *
   * x.tan().print();  // or tf.tan(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static tan<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'tan');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict($x.cos().square())};
    };
    return ENV.engine.runKernel(backend => backend.tan($x), {$x}, grad);
  }

  /**
   * Computes asin of the input `Tensor` element-wise: `asin(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.asin().print();  // or tf.asin(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static asin<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'asin');

    const grad = (dy: T) => {
      return {
        $x: () => dy.divStrict(scalar(1).sub($x.toFloat().square()).sqrt() as T)
      };
    };
    return ENV.engine.runKernel(backend => backend.asin($x), {$x}, grad);
  }

  /**
   * Computes acos of the input `Tensor` element-wise: `acos(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.acos().print();  // or tf.acos(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static acos<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'acos');

    const grad = (dy: T) => {
      return {
        $x: () =>
            dy.divStrict(scalar(1).sub($x.toFloat().square()).sqrt() as T).neg()
      };
    };
    return ENV.engine.runKernel(backend => backend.acos($x), {$x}, grad);
  }

  /**
   * Computes atan of the input `Tensor` element-wise: `atan(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.atan().print();  // or tf.atan(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static atan<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'atan');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict(scalar(1).add($x.toFloat().square()))};
    };
    return ENV.engine.runKernel(backend => backend.atan($x), {$x}, grad);
  }

  /**
   * Computes hyperbolic sin of the input `Tensor` element-wise: `sinh(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.sinh().print();  // or tf.sinh(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static sinh<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'sinh');

    const grad = (dy: T) => {
      return {$x: () => $x.toFloat().cosh().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.sinh($x), {$x}, grad);
  }

  /**
   * Computes hyperbolic cos of the input `Tensor` element-wise: `cosh(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.cosh().print();  // or tf.cosh(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static cosh<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'cosh');

    const grad = (dy: T) => {
      return {$x: () => $x.toFloat().sinh().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.cosh($x), {$x}, grad);
  }

  /**
   * Computes hyperbolic tangent of the input `Tensor` element-wise: `tanh(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, 70]);
   *
   * x.tanh().print();  // or tf.tanh(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static tanh<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'tanh');

    const grad = (dy: T, saved: Tensor[]) => {
      const [y] = saved;
      return {$x: () => scalar(1).sub(y.square()).mulStrict(dy) as T};
    };
    return ENV.engine.runKernel(
        (backend, save) => save(backend.tanh($x)), {$x}, grad);
  }

  /**
   * Computes inverse hyperbolic sin of the input `Tensor` element-wise:
   * `asinh(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, 1, -1, .7]);
   *
   * x.asinh().print();  // or tf.asinh(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static asinh<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'asinh');

    const grad = (dy: T) => {
      return {
        $x: () => dy.divStrict(scalar(1).add($x.toFloat().square()).sqrt() as T)
      };
    };
    return ENV.engine.runKernel(backend => backend.asinh($x), {$x}, grad);
  }

  /**
   * Computes the inverse hyperbolic cos of the input `Tensor` element-wise:
   * `acosh(x)`
   *
   * ```js
   * const x = tf.tensor1d([10, 1, 3, 5.7]);
   *
   * x.acosh().print();  // or tf.acosh(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static acosh<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'acosh');

    const grad = (dy: T) => {
      return {
        $x: () => dy.divStrict($x.toFloat().square().sub(scalar(1)).sqrt() as T)
      };
    };
    return ENV.engine.runKernel(backend => backend.acosh($x), {$x}, grad);
  }

  /**
   * Computes inverse hyperbolic tan of the input `Tensor` element-wise:
   * `atanh(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, .1, -.1, .7]);
   *
   * x.atanh().print();  // or tf.atanh(x)
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static atanh<T extends Tensor>(x: T|TensorLike): T {
    const $x = convertToTensor(x, 'x', 'atanh');

    const grad = (dy: T) => {
      return {$x: () => dy.divStrict(scalar(1).sub($x.toFloat().square()))};
    };
    return ENV.engine.runKernel(backend => backend.atanh($x), {$x}, grad);
  }

  /**
   * Computes gause error function of the input `Tensor` element-wise:
   * `erf(x)`
   *
   * ```js
   * const x = tf.tensor1d([0, .1, -.1, .7]);
   *
   * x.erf().print(); // or tf.erf(x);
   * ```
   * @param x The input tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static erf<T extends Tensor>(x: T|TensorLike): T {
    let $x = convertToTensor(x, 'x', 'erf');
    util.assert(
        $x.dtype === 'int32' || $x.dtype === 'float32',
        'Input dtype must be `int32` or `float32`.');

    if ($x.dtype === 'int32') {
      $x = $x.toFloat();
    }

    const grad = (dy: T) => {
      return {
        $x: () => dy.mulStrict(
            scalar(2 / Math.sqrt(Math.PI)).mul($x.square().neg().exp()))
      };
    };
    return ENV.engine.runKernel(backend => backend.erf($x), {$x}, grad);
  }

  /**
   * Computes step of the input `Tensor` element-wise: `x > 0 ? 1 : alpha * x`
   *
   * ```js
   * const x = tf.tensor1d([0, 2, -1, -3]);
   *
   * x.step(.5).print();  // or tf.step(x, .5)
   * ```
   * @param x The input tensor.
   * @param alpha The gradient when input is negative.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  static step<T extends Tensor>(x: T|TensorLike, alpha = 0.0): T {
    const $x = convertToTensor(x, 'x', 'step');

    // TODO(manrajgrover): Return null for gradients when backprop supports
    // it.
    const grad = (dy: T) => {
      return {$x: () => zerosLike(dy)};
    };
    return ENV.engine.runKernel(backend => backend.step($x, alpha), {$x}, grad);
  }
}

export const abs = op(UnaryOps.abs);
export const acos = op(UnaryOps.acos);
export const acosh = op(UnaryOps.acosh);
export const asin = op(UnaryOps.asin);
export const asinh = op(UnaryOps.asinh);
export const atan = op(UnaryOps.atan);
export const atanh = op(UnaryOps.atanh);
export const ceil = op(UnaryOps.ceil);
export const clipByValue = op(UnaryOps.clipByValue);
export const cos = op(UnaryOps.cos);
export const cosh = op(UnaryOps.cosh);
export const erf = op(UnaryOps.erf);
export const exp = op(UnaryOps.exp);
export const expm1 = op(UnaryOps.expm1);
export const floor = op(UnaryOps.floor);
export const log = op(UnaryOps.log);
export const log1p = op(UnaryOps.log1p);
export const logSigmoid = op(UnaryOps.logSigmoid);
export const neg = op(UnaryOps.neg);
export const reciprocal = op(UnaryOps.reciprocal);
export const round = op(UnaryOps.round);
export const rsqrt = op(UnaryOps.rsqrt);
export const sigmoid = op(UnaryOps.sigmoid);
export const sign = op(UnaryOps.sign);
export const sin = op(UnaryOps.sin);
export const sinh = op(UnaryOps.sinh);
export const softplus = op(UnaryOps.softplus);
export const sqrt = op(UnaryOps.sqrt);
export const square = op(UnaryOps.square);
export const step = op(UnaryOps.step);
export const tan = op(UnaryOps.tan);
export const tanh = op(UnaryOps.tanh);
