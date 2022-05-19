function addmod(x, y, n) {
	// Precondition: x<n, y<n
	// If it will overflow, use alternative calculation
	if (x + y <= x) x = x - ((n - y) % n)
	else x = (x + y) % n
	return x
}

function sqrmod(a, n) {
	let b
	let sum = 0

	// Make sure original number is less than n
	a = a % n

	// Use double and add algorithm to calculate a*a mod n
	for (b = a; b != 0; b >>= 1) {
		if (b & 1) {
			sum = addmod(sum, a, n)
		}
		a = addmod(a, a, n)
	}
	return sum
}

export function powFun(base, ex, mo) {
	let r
	if (ex === 0) return 1
	else if (ex % 2 === 0) {
		r = powFun(base, ex / 2, mo) % mo
		// return (r * r) % mo;
		return sqrmod(r, mo)
	} else return (base * powFun(base, ex - 1, mo)) % mo
}
