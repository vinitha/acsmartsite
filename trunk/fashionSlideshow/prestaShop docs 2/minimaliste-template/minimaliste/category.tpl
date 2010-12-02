{include file=$tpl_dir./breadcrumb.tpl} 
{include file=$tpl_dir./errors.tpl}
{if $category->active}
<h2>
	{$category->name|escape:'htmlall':'UTF-8'}
	<span>{$nb_products|intval}&nbsp;{if $nb_products>1}{l s='products'}{else}{l s='product'}{/if}</span>
</h2>
{if $scenes}
	<!-- Scenes -->
	{include file=$tpl_dir./scenes.tpl scenes=$scenes}
{else}
	<!-- Category image -->
	{if $category->id_image}
		<img src="{$img_cat_dir}{$category->id_image}-category.jpg" alt="{$category->name|escape:'htmlall':'UTF-8'}" title="{$category->name|escape:'htmlall':'UTF-8'}" id="categoryImage" />
	{/if}
    {/if}	
    {if $category->description}
     <div class="cat_desc">{$category->description}</div>
    {/if}
    {if $products}
		{include file=$tpl_dir./product-sort.tpl}
		{include file=$tpl_dir./product-list.tpl products=$products}
		{include file=$tpl_dir./pagination.tpl}
	{elseif !isset($subcategories)}
		<li class="warning">{l s='There is no product in this category.'}</li>
	{/if}
    {else}
	<li class="warning">{l s='This category is currently unavailable.'}</li>
{/if}
