{capture name=path}{l s='My account'}{/capture}
{include file=$tpl_dir./breadcrumb.tpl}
<h2>
  <strong style="float:left; background: #f4f8f9;">{l s='My account'}</strong>
  <a href="{$base_dir}index.php?mylogout" id="logout" title="{l s='log out'}">{l s='Sign out'}</a>
  </h2>
<div id="myaccountnav">
		<ul>
	        <li class="bnthyshome"><a href="{$base_dir_ssl}my-account.php" class="selected">{l s='Home'}</a></li>
			<li><a href="{$base_dir_ssl}history.php" title="">{l s='orders'}</a></li>
			<li><a href="{$base_dir_ssl}order-slip.php" title="">{l s='credit slips'}</a></li>
			<li><a href="{$base_dir_ssl}discount.php" title="">{l s='vouchers'}</a></li>
		    <li><a href="{$base_dir_ssl}order-follow.php">{l s='Merchandise returns'}</a></li>
			<li><a href="{$base_dir_ssl}addresses.php"  title="">{l s='addresses'}</a></li>
			<li><a href="{$base_dir_ssl}identity.php" title="">{l s='personal info'}</a></li>
		</ul>
</div>
<ul id="myaccount">
    <li id="accountwelcome">{l s='Welcome to your account. Here you can manage your addresses and orders.'}</li>
	<li><a href="{$base_dir_ssl}history.php" title="{l s='Orders'}"><img src="{$img_dir}icon/order.gif" alt="{l s='Orders'}" class="icon" /></a><a href="{$base_dir_ssl}history.php" title="{l s='Orders'}">{l s='History and details of your orders'}</a></li>
	{if $returnAllowed}
	<li><a href="{$base_dir_ssl}order-follow.php" title="{l s='Merchandise returns'}"><img src="{$img_dir}icon/return.gif" alt="{l s='Merchandise returns'}" class="icon" /></a><a href="{$base_dir_ssl}order-follow.php" title="{l s='Merchandise returns'}">{l s='Merchandise returns'}</a></li>
	{/if}
	<li><a href="{$base_dir_ssl}order-slip.php" title="{l s='Orders'}"><img src="{$img_dir}icon/slip.gif" alt="{l s='Orders'}" class="icon" /></a><a href="{$base_dir_ssl}order-slip.php" title="{l s='Credit slips'}">{l s='Credit slips'}</a></li>
	{if $voucherAllowed}
	<li><a href="{$base_dir_ssl}discount.php" title="{l s='Vouchers'}"><img src="{$img_dir}icon/voucher.gif" alt="{l s='Vouchers'}" class="icon" /></a><a href="{$base_dir_ssl}discount.php" title="{l s='Vouchers'}">{l s='Your vouchers'}</a></li>
	{/if}
	<li><a href="{$base_dir_ssl}addresses.php" title="{l s='Addresses'}"><img src="{$img_dir}icon/addrbook.gif" alt="{l s='Addresses'}" class="icon" /></a><a href="{$base_dir_ssl}addresses.php" title="{l s='Addresses'}">{l s='Your addresses'}</a></li>
	<li><a href="{$base_dir_ssl}identity.php" title="{l s='Information'}"><img src="{$img_dir}icon/userinfo.gif" alt="{l s='Information'}" class="icon" /></a><a href="{$base_dir_ssl}identity.php" title="{l s='Information'}">{l s='Your personal information'}</a></li>
	{$HOOK_CUSTOMER_ACCOUNT}
</ul>