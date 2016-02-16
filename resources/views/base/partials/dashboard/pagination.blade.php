@if (count($pages) )
	<div class="pagination" data-pages="<?php echo $pages; ?>" <?php echo (isset($view))? 'data-view="'.$view.'"':''; ?>></div>
@endif