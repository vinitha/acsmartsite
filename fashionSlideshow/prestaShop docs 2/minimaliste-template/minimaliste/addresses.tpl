{capture name=path}<a href="my-account.php">{l s='My account'}</a><span class="navigation-pipe">{$navigationPipe}</span>{l s='My addresses'}{/capture}
{include file=$tpl_dir./breadcrumb.tpl}
<h2>
  <strong style="float:left; background: #f4f8f9;">{l s='My account'}</strong>
  <a href="{$base_dir}index.php?mylogout" id="logout" title="{l s='log out'}">{l s='Sign out'}</a>
</h2>
<div id="myaccountnav">
		<ul>
	        <li class="bnthyshome"><a href="{$base_dir_ssl}my-account.php">{l s='Home'}</a></li>
			<li><a href="{$base_dir_ssl}history.php" title="">{l s='orders'}</a></li>
			<li><a href="{$base_dir_ssl}order-slip.php" title="">{l s='credit slips'}</a></li>
			<li><a href="{$base_dir_ssl}discount.php" title="">{l s='vouchers'}</a></li>
		    <li><a href="{$base_dir_ssl}order-follow.php">{l s='Merchandise returns'}</a></li>
			<li><a href="{$base_dir_ssl}addresses.php"  class="selected" title="">{l s='addresses'}</a></li>
			<li><a href="{$base_dir_ssl}identity.php" title="">{l s='personal info'}</a></li>
		</ul>
</div>
<div id="divadress">
<p>{l s='Configure your billing and delivery addresses that will be preselected by default when you make an order. You can also add additional addresses, which can be useful for sending gifts or receiving your order at the office.'}</p>

{if $addresses}
	<h3>{l s='Your addresses are listed below.'}</h3>
	<p>{l s='Be sure to update them if they have changed.'}</p>

	{foreach from=$addresses item=address name=myLoop}
	<ul class="address {if $smarty.foreach.myLoop.last}last_item{elseif $smarty.foreach.myLoop.first}first_item{/if} {if $smarty.foreach.myLoop.index % 2}alternate_item{else}item{/if}">
		<li class="address_title">{$address.alias}</li>
		{if $address.company}<li class="address_company">{$address.company}</li>{/if}
		<li class="address_name">{$address.firstname} {$address.lastname}</li>
		<li class="address_address1">{$address.address1}</li>
		{if $address.address2}<li class="address_address2">{$address.address2}</li>{/if}
		<li class="address_city">{$address.postcode} {$address.city}</li>
		<li class="address_country">{$address.country}{if isset($address.state)} ({$address.state}){/if}</li>
		{if $address.phone}<li class="address_phone">{$address.phone}</li>{/if}
		{if $address.phone_mobile}<li class="address_phone_mobile">{$address.phone_mobile}</li>{/if}
	</ul>
	{/foreach}
	<p class="clear" />
</div>
{else}
	<p class="warning">{l s='No addresses available.'}&nbsp;<a href="{$base_dir_ssl}address.php">{l s='add a new one!'}</a></p>
{/if}

 <ul class="clear address_add">
	<a href="{$base_dir_ssl}address.php?id_address={$address.id_address|intval}" title="{l s='Update'}" class="address_update">{l s='Update'}</a>
	<a href="{$base_dir_ssl}address.php?id_address={$address.id_address|intval}&amp;delete" onclick="return confirm('{l s='Are you sure?'}');" title="{l s='Delete'}" class="address_delete">{l s='Delete'}</a>
    <a href="{$base_dir_ssl}address.php" title="{l s='Add an address'}" class="address_add">{l s='Add an address'}</a>
 </ul>
<br /><br />
</div>