<link href="{$base_dir}modules/categoriesbar/chromestyle.css" rel="stylesheet" type="text/css" media="all" />
<script type="text/javascript" src="{$base_dir}modules/categoriesbar/chrome.js"></script>
<!-- Categories Bar module -->
<div class="chromestyle" id="chromemenu">   
	<ul>
	{foreach from=$categoriesLevel.children item=child name=categoriesLevel}
		{if $smarty.foreach.categoriesLevel.last}
			{include file=$bar_tpl_path node=$child last='true'}
		{else}
			{include file=$bar_tpl_path node=$child}
		{/if}
	{/foreach}
	</ul>
</div>    
<!-- /Categories Bar module -->
<script type="text/javascript">cssdropdown.startchrome("chromemenu")</script>