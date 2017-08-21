var globalJIRA = {};

globalJIRA.LabelsButton = function() {
	let newItem = `	<li>
						<a class="aui-nav-link aui-dropdown2-trigger " id="ts-custom-labels-link" href="" aria-haspopup="true" aria-owns="ts-custom-labels-link-content" aria-controls="ts-custom-labels-link-content">Automated Labels</a>
						<div id="ts-custom-labels-link-content" class="aui-dropdown2 aui-style-default aui-dropdown2-in-header" data-dropdown2-alignment="left" aria-hidden="true">
							<div class="aui-dropdown2-section">
								<ul id="report" class="aui-list-truncate">
									<li><a href="/issues/?jql=labels%20%3D%20css-automated-nodue">No Due Date</a></li>
									<li><a href="/issues/?jql=labels%20%3D%20css-automated-noquote">No Quote</a></li>
								</ul>
							</div>
						</div>
					</li>`;
	$(newItem).insertBefore('.aui-header-primary .aui-nav > li:last-child');
}

globalJIRA.init = function() {
	globalJIRA.LabelsButton();
}

globalJIRA.init();