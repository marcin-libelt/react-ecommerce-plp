<?php


namespace Discount\ReactCategory\Block\Category;


class View extends \Magento\Framework\View\Element\Template
{

    protected $storeManager;
    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;

    /**
     * View constructor.
     * @param \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $collectionFactory
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     *
     */
    public function __construct(
        \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $collectionFactory,
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_collectionFactory = $collectionFactory;
        $this->_coreRegistry = $registry;
        $this->_storeManager = $storeManager;
        parent::__construct($context, $data);
    }

    protected function _prepareLayout()
    {
        parent::_prepareLayout();
        $category = $this->getCurrentCategory();

        $categoryTitle = "";

        if ($category) {
            $categoryTitle = $category->getName();
            if($category->getMetaTitle() != "") {
                $categoryTitle = $category->getMetaTitle();
            }
        }

        $this->pageConfig->getTitle()->set($categoryTitle);
    }

    public function getCurrentCategory()
    {
        return $this->_coreRegistry->registry('current_category');
    }

    public function getTopCategoriesJson()
    {
        $categoryCollection = $this->_collectionFactory->create();
        $categoryCollection->addAttributeToFilter('is_active', 1);
        $categoryCollection->addAttributeToFilter('level', 2);
        $categoryCollection->addAttributeToSelect(['level', 'name']);

        foreach ($categoryCollection as $category) {
            $isActive = $this->getCurrentCategory()->getId() === $category->getId();
            $options[] = ['label' => $category->getName(), 'url' => $category->getUrl(), 'isActive' => $isActive];
        }

        return json_encode($options);
    }

    public function getStore()
    {
        return $this->_storeManager->getStore();
    }

    public function getStoreCode()
    {
        return $this->getStore()->getCode();
    }
}
