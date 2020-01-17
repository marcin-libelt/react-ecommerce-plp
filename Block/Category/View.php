<?php


namespace Discount\ReactCategory\Block\Category;


class View extends \Magento\Framework\View\Element\Template
{

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;

    /**
     * View constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param array $data
     */
    public function __construct(
        \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $collectionFactory,
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_collectionFactory = $collectionFactory;
        $this->_coreRegistry = $registry;
        parent::__construct($context, $data);
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
}
