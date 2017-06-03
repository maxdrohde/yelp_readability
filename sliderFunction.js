function outputUpdate(bandwidth) {
	document.querySelector('#bandwidth').value = bandwidth;
	chart1.violinPlots.show({reset:true, width:75, clamp:0, resolution:30, bandwidth:bandwidth});
	chart1.boxPlots.hide();
    chart1.notchBoxes.hide();
}