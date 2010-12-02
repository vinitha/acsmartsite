<!-- MODULE Block specials -->
<div id="categories_block_left" class="block products_block blockspecials">
	<h4><a href="{$base_dir}prices-drop.php" title="{l s='Specials' mod='blockspecials'}">{l s='Specials' mod='blockspecials'}</a></h4>
	<div class="blockspecials">
{if $special}
		<ul class="blockspecials">
			<li class="blockspecials">
				<a href="{$special.link}"><img src="{$img_prod_dir}{$special.id_image}-medium.jpg" alt="{$special.legend|escape:htmlall:'UTF-8'}" title="{$special.name|escape:htmlall:'UTF-8'}" /></a>
			</li>
			<li class="li_info">
				<h5><a href="{$special.link}" title="{$special.name|escape:htmlall:'UTF-8'}">{$special.name|escape:htmlall:'UTF-8'|truncate:20}</a></h5>
				<span class="chiftpirce">{displayWtPrice p=$special.price_without_reduction}</span>
				{if $special.reduction_percent}<span class="reduction">(-{$special.reduction_percent}%)</span>{/if}
				<span class="newpirce">{displayWtPrice p=$special.price}</span>
                <a class="linkview" href="{$special.link}" title="{$special.name|escape:htmlall:'UTF-8'}">{l s='View' mod='blockspecials'}</a>			
			</li>
		</ul>
		<p class="allspecials">
			<a href="{$base_dir}prices-drop.php" title="{l s='All specials' mod='blockspecials'}">{l s='All specials' mod='blockspecials'}</a>
		</p>
{else}
		<p>{l s='No specials at this time' mod='blockspecials'}</p>
{/if}
	</div>
</div>
<!-- /MODULE Block specials -->