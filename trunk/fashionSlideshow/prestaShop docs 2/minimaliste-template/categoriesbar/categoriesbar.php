<?php
/** This module was created by Alpha Media © 06/08/08
 *  Alternative Horizontal Navigation for Pretashop based on Dynamicdrive
 *  CSS Menu Dropdown Script - http://www.dynamicdrive.com/dynamicindex1/chrome/index.htm
/****************************************************************************************/

class CategoriesBar extends Module
{
	public function __construct()
	{
		$this->name = 'categoriesbar';
		$this->tab = 'Blocks';
		$this->version = 0.5; /****** Module created by Alpha Media © 08/08/08 ******/
		
		/* The parent construct is required for translations */
		parent::__construct();
		
		$this->page = basename(__FILE__, '.php');
		$this->displayName = $this->l('Horizontal Navigation Bar Module');
		$this->description = $this->l('Adds new hook to Display your Categories (Alpha Media)');
	}

	/**
	* Installs Module & Adds New Navigation Hook into the DB
	*
	* @param array $params Parameters
	* @return string Content
	*/
	public function install()
    {
        $name = "navBar";
        $title = "Navigation Bar";
        $description = "Hooks the Navigation Bar onto the top of your page";
        $position = "1";
		
		if (parent::install() == false OR $this->registerHook('top') == false)
			return false;
 	 	return Db::getInstance()->Execute('INSERT INTO `'._DB_PREFIX_.'hook` (`id_hook`, `name`, `title`, `description`, `position`) VALUES ("'.intval($this->id).'", "'.$name.'", "'.$title.'", "'.$description.'", "'.$position.'")');

    }

 	public function uninstall()
 	{
 	 	if (!parent::uninstall())
 	 		return false;
 		return Db::getInstance()->Execute('DELETE FROM `'._DB_PREFIX_.'hook` WHERE `id_hook` = '.intval($this->id));
	}


	/**
	* Returns module content for header
	*
	* @param array $params Parameters
	* @return string Content
	*/
	function hookTop($params)
	{
		global $smarty;

		//construct categories
		$depth = 0;
		$rootCateg = Category::getRootCategory()->recurseLiteCategTree($depth);

		if (isset($_GET['id_category']))
		$smarty->assign('currentCategoryId', intval($_GET['id_category']));
		$smarty->assign('bar_tpl_path', _PS_MODULE_DIR_.'categoriesbar/category-bar-level.tpl');
		$smarty->assign('categoriesLevel', $rootCateg);
	
		return $this->display(__FILE__, 'categoriesbar.tpl');
	}
	
	function hookNavbar($params)
	{
		return $this->hookTop($params);
	}
			
}

?>