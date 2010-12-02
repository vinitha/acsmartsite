<!-- MODULE Home Featured Products -->
<div id="features_products_block" class="block products_block">
	<h4>{l s='featured products' mod='homefeatured'}</h4>
	{if isset($products) AND $products}
		<div class="block_content">
		 {assign var='liHeight' value=360}
		 {assign var='nbItemsPerLine' value=4}
		 {assign var='nbLi' value=$products|@count}
		 {assign var='nbLines' value=$nbLi/$nbItemsPerLine|ceil}
		 {assign var='ulHeight' value=$nbLines*$liHeight}
		  <ul>
			{foreach from=$products item=product name=homeFeaturedProducts}
			{assign var='productLink' value=$link->getProductLink($product.id_product, $product.link_rewrite, $product.category)}
			<li class="ajax_block_product {if $smarty.foreach.homeFeaturedProducts.first}first_item{elseif $smarty.foreach.homeFeaturedProducts.last}last_item{else}item{/if} {if $smarty.foreach.homeFeaturedProducts.iteration%$nbItemsPerLine == 0}last_item_of_line{elseif $smarty.foreach.homeFeaturedProducts.iteration%$nbItemsPerLine == 1}first_item_of_line{/if} {if $smarty.foreach.homeFeaturedProducts.iteration > ($smarty.foreach.homeFeaturedProducts.total - ($smarty.foreach.homeFeaturedProducts.total % $nbItemsPerLine))}last_line{/if}">
			  <h5 class="h5">
			    <a class="h5" href="{$productLink}" title="{$product.name|escape:htmlall:'UTF-8'|truncate:20}">{$product.name|escape:htmlall:'UTF-8'|truncate:20}</a>
			  </h5>
			  <p>
			  <a href="{$productLink}" title="{$product.legend|escape:htmlall:'UTF-8'}">
			  <img src="{$img_prod_dir}{$product.id_image}-home.jpg" alt="{$product.legend|escape:htmlall:'UTF-8'}" height="80" width="80" /></a>
			  </p>
			  <p class="pprice">{displayWtPrice p=$product.price}</p>
			  <p>
			  <a href="{$productLink}" title="{l s='View' mod='homefeatured'}">{l s='View' mod='homefeatured'}</a>
			   {if ($product.quantity > 0 OR $product.allow_oosp) AND $product.customizable != 2}
			   <a class="ajax_add_to_cart_button" rel="ajax_id_product_{$product.id_product}" href="{$base_dir}cart.php?qty=1&amp;id_product={$product.id_product}&amp;token={$static_token}&amp;add" title="{l s='Add to cart' mod='homefeatured'}">{l s='Add to Cart' mod='homefeatured'}</a><br /><br />
			  </p>
				 {else}
				 <span class="exclusive">{l s='Add to cart' mod='homefeatured'}</span>
				{/if}
			  </p>
			 </li>
			 {/foreach}
			</ul>
		</div>
	    {else}
		<p>{l s='No featured products' mod='homefeatured'}</p>
	{/if}
</div>
<!-- /MODULE Home Featured Products -->
