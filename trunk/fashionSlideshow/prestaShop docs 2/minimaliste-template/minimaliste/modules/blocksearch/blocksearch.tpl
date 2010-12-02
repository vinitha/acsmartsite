<!-- Block search module -->
<div id="search_block_left" class="block">
	<form method="get" action="{$base_dir}search.php" id="searchbox">
			<input type="hidden" name="orderby" value="position" />
			<input type="hidden" name="orderway" value="desc" />
		<input type="text" id="search_query" name="search_query" value="{if isset($smarty.get.search_query)}{$smarty.get.search_query|htmlentities:$ENT_QUOTES:'utf-8'}{else}{l s='Search' mod='blocksearch'}{/if}" onfocus="javascript:if(this.value=='{l s='Search' mod='blocksearch'}')this.value='';" onblur="javascript:if(this.value=='')this.value='{l s='Search' mod='blocksearch'}';" />
			<input type="submit" id="search_button" value="" />
    </form>
</div>
{if $ajaxsearch}
	<script type="text/javascript">
		{literal}
		
		function formatSearch(row) {
			return row[2] + ' > ' + row[1];
		}
		
		function redirectSearch(event, data, formatted) {
			$('#search_query').val(data[1]);
			document.location.href = data[3];
		}
		
		$('document').ready( function() {
			$("#search_query").autocomplete(
				'{/literal}{$base_dir}{literal}search.php', {
				minChars: 3,
				max:10,
				width:500,
				scroll: false,
				formatItem:formatSearch,
				extraParams:{ajaxSearch:1,id_lang:{/literal}{$cookie->id_lang}{literal}}
			}).result(redirectSearch)
		});
		{/literal}
	</script>
{/if}
<!-- /Block search module -->
