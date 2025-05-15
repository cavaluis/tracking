function disableCheckout() {
    var src = document.getElementById('field-customer-custom-src');
    var checkout_button = document.querySelector('.builder-v2-block-core_fields_buy_button .button');

    // Agrega un evento al campo de src para realizar la validación al salir del campo
    src.addEventListener('blur', function (event) {
        if (src.value.trim() !== '') {
        var url = 'https://hook.us1.make.com/og46kc584ggja2wx4y2qjy8vurcrkpp7/' + '?src=' + encodeURIComponent(src.value.trim());
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (responseText) {
                if (responseText.trim().toLowerCase() === 'valid') {
                    console.log('SRC Válido. Puedes continuar con el pago.');
                    checkout_button.disabled = false; // Habilita el botón de pagar
                } else {
                    console.error('SRC inválido. No puedes continuar con el pago.');
                    checkout_button.disabled = true; // Deshabilita el botón de pagar
                    checkout_button.addEventListener('click', function (event) {
                    if (checkout_button.disabled) {
                        event.preventDefault(); // Cancela el evento de clic si el botón está deshabilitado
                    }
                    });
                    alert('La referencia NO es válida, por favor solicita a tu asesor una referencia válida para poder identificar tu pago.');
                }
            })
            .catch(function (error) {
                console.error('Ocurrió un error al realizar la validación:', error);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    disableCheckout();
});
