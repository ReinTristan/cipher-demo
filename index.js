function qs(selector) {
	return document.querySelector(selector)
}

function generateKeys() {
	const prime = parseInt(qs('#keyPrime').value)
	if (!isPrime2(prime)) {
		primeAlert()
		return
	}

	const secret1 = parseInt(qs('#keySecret1').value)
	const secret2 = parseInt(qs('#keySecret2').value)
	const gValue = parseInt(qs('#keyG').value)

	const publicKeyA = gValue ** secret1 % prime
	const publicKeyB = gValue ** secret2 % prime
	const privateKeyA = publicKeyB ** secret1 % prime
	const privateKeyB = publicKeyA ** secret2 % prime

	const label1 = qs('#user1Label')
	const label2 = qs('#user2Label')
	label1.textContent = `User 1 Key: (${privateKeyA})`
	label2.textContent = `User 2 Key: (${privateKeyB})`

	qs('#cipherKey').value = privateKeyA
	qs('#decipherKey').value = privateKeyA
}

function primeAlert() {
	const keyPrimeInput = qs('#keyPrime')
	const alertDiv = document.createElement('div')
	alertDiv.classList.add(
		'alert',
		'alert-danger',
		'alert-dismissible',
		'fade',
		'show'
	)
	const alertText = document.createElement('p')
	alertText.textContent = 'El numero no es primo'
	const closeBtn = document.createElement('button')
	closeBtn.classList.add('btn-close')
	closeBtn.dataset.bsDismiss = 'alert'
	alertDiv.append(alertText)
	alertDiv.append(closeBtn)

	keyPrimeInput.insertAdjacentElement('afterend', alertDiv)
}

function isPrime2(n) {
	if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false
	if (n % 2 == 0) return n == 2
	let m = Math.sqrt(n)
	for (let i = 3; i <= m; i += 2) {
		if (n % i == 0) return false
	}
	return true
}

function mod(n, m) {
	return ((n % m) + m) % m
}

function reduceMod({ base, exponent = 1, divisor }) {
	if (exponent === 1) {
		const mod = base ** exponent % divisor
		return mod
	}
}
const cipherEcuation = ({ code, key, primeDivisor }) =>
	((code + key ** 2) % primeDivisor) + 1

const decipherEcuation = ({ code, key, primeDivisor }) => {
	let decipherDividend = -1 + (code - key ** 2)
	return mod(decipherDividend, primeDivisor)
}

function cipher() {
	const key = parseInt(qs('#cipherKey').value)
	const originalMessage = qs('#originalMessage').value
	const primeDivisor = parseInt(qs('#keyPrime').value)
	const originalMessageArray = Array.from(originalMessage)

	const originalMessageCodes = originalMessageArray.map((char) =>
		char.codePointAt()
	)

	const cipherMessageCodes = originalMessageCodes.map((code) => {
		return cipherEcuation({ code, key, primeDivisor })
	})
	console.group('Codigos Originales')
	console.log(originalMessageCodes)
	console.groupEnd('Codigos Originales')

	console.group('Codigos Cifrados')
	console.log(cipherMessageCodes)
	console.groupEnd('Codigos Cifrados')

	const cipherMessageArray = cipherMessageCodes.map((code) => {
		return String.fromCodePoint(code)
	})
	const cipherMessage = cipherMessageArray.join('')

	printResult(cipherMessage, 'cipher-result')
}

function decipher() {
	const key = parseInt(qs('#decipherKey').value)
	const cipherMessage = qs('#cipherMessage').value
	const primeDivisor = parseInt(qs('#keyPrime').value)

	const cipherMessageArray = Array.from(cipherMessage)
	const cipherMessageCodes = cipherMessageArray.map((char) =>
		char.codePointAt(0)
	)
	const decipherMessageCodes = cipherMessageCodes.map((code) => {
		return decipherEcuation({ code, key, primeDivisor })
	})
	console.group('Codigos cifrados')
	console.log(cipherMessageCodes)
	console.groupEnd('Codigos cifrados')

	console.group('Codigos decifrados')
	console.log(decipherMessageCodes)
	console.groupEnd('Codigos decifrados')

	const decipherMessageArray = decipherMessageCodes.map((code) => {
		return String.fromCodePoint(code)
	})
	const decipherMessage = decipherMessageArray.join('')

	printResult(decipherMessage, 'decipher-result')
}

function printResult(message, element) {
	const result = qs(`#${element}`)
	result.innerHTML = ''

	const resultText = document.createElement('textarea')
	resultText.value = message
	resultText.classList.add('form-control')
	resultText.setAttribute('id', 'cipher-result-text')
	resultText.setAttribute('readonly', '')

	const resultTitle = document.createElement('label')
	resultTitle.textContent = 'Result:'
	resultTitle.classList.add('form-label')
	resultTitle.setAttribute('for', 'cipher-result-text')

	result.append(resultTitle)
	result.append(resultText)
}
const generateBtn = qs('#keyGen-btn')
generateBtn.addEventListener('click', () => generateKeys())

const cipherBtn = qs('#cipher-btn')
cipherBtn.addEventListener('click', () => cipher())

const decipherBtn = qs('#decipher-btn')
decipherBtn.addEventListener('click', () => decipher())
