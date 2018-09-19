	
	// payment
	function openmethods(methods_pay) {
		var i;
		var x = document.getElementsByClassName("methods");
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}
		document.getElementById(methods_pay).style.display = "block";
		/ document.getElementByName("text").checked = true; /
	}
	
	//delivery
	$("#shippingmethod").change(
			function() {
				var selectedOption = $('#shippingmethod').val();
				var orginal_amounttotal = $('#orginal_amounttotal').html();
				$.get("product/get/shipping/" + selectedOption, function(data) {
					if (data != null) {

						$("#shippingmethodfee").html(
								findAndReplace(data, ',', '.'));
						var x = parseFloat(findAndReplace(orginal_amounttotal,
								'.', ''));
						var y = parseFloat(findAndReplace(data, ',', ''));
						$("#amounttotal").html(numberWithCommas(x + y));
					}
				}, "text")

	});
	//format
	function findAndReplace(string, target, replacement) {
		var i = 0, length = string.length;
		for (i; i < length; i++) {
			string = string.replace(target, replacement);
		}
		return string;
	}

	function numberWithCommas(n) {
		var parts = n.toString().split(",");
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
				+ (parts[1] ? "," + parts[1] : "");
	}

