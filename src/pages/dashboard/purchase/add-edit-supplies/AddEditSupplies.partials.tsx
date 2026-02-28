import { useEffect, useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/atoms/button/Button";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { useOutsideClick } from "@/utils/hooks.utils";
import type { Product } from "@/utils/types.utils";
import { SectionWrapper } from "@/components/molecules/section-wrapper/SectionWrapper";
import { DropdownWithSearch } from "@/components/molecules/dropdown-with-search/DropdownWithSearch";
import {
  getProductDetails,
  getProductsViaLiveSearch,
  getPurchasesToCreate,
  removeFromPurchasesToCreate,
} from "./AddEditSupplier.utils";
import type {
  CreateOrEditSuppliesHeaderProps,
  ProductItemListProps,
} from "./AddEditSupplies.types";
import { Form } from "@/components/atoms/form/Form";

export function CreateOrEditSuppliesHeader({
  title,
  onSelectPurchaseToCreate,
}: CreateOrEditSuppliesHeaderProps): React.JSX.Element {
  const [showList, setShowList] = useState(false);
  const [savePurchases, setSavedPurchases] = useState<Array<number>>([]);

  const handleOutsideClick = () => {
    setShowList(false);
  };
  useOutsideClick(handleOutsideClick);

  useEffect(() => {
    setSavedPurchases(getPurchasesToCreate().map((item) => item.id));
  }, []);

  const removeFromSavedOrders = (id: number): void => {
    setSavedPurchases(removeFromPurchasesToCreate(id).map((item) => item.id));
  };

  return (
    <PageDescriptor title={title}>
      <div className="relative">
        <Button
          el="button"
          variant="outline"
          className="flex! items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowList((prevState) => !prevState);
          }}
        >
          <FiEye className="text-xl" />
          <span>View saved list</span>
        </Button>
        {showList && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 p-2 w-62.5 rounded-md shadow-md max-h-37.5 overflow-y-auto z-1">
            {savePurchases.map((item) => (
              <div key={item} className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPurchaseToCreate(item);
                  }}
                  className="text-left py-1.5 hover:font-semibold cursor-pointer ps-2"
                >
                  Order - #{item}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromSavedOrders(item);
                  }}
                  className="w-8 h-8 rounded-sm cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
            ))}
            {!savePurchases.length ? (
              <p className="ps-2">No items available</p>
            ) : null}
          </div>
        )}
      </div>
    </PageDescriptor>
  );
}

export function ProductItemList({
  supplies,
  onAddSupply,
  onRemoveItem,
  onSetAlertDetails,
  onHandleCommentChange,
  onHandleBoxNumberChange,
}: ProductItemListProps): React.JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const addSelectedProduct = (): void => {
    if (!selectedProduct) {
      onSetAlertDetails({
        message: "Please ensure that a product is selected",
        variant: "error",
      });
      return;
    }

    onAddSupply(selectedProduct);
    setSelectedProduct(undefined);
  };

  return (
    <SectionWrapper heading="Supplies">
      <p className="mb-2">
        Please the product name name in the input field below to update the
        search term
      </p>
      <DropdownWithSearch
        placeholder="Search by product name"
        selectedItem={selectedProduct}
        onSetSelectedItem={setSelectedProduct}
        onGetValue={getProductDetails}
        onGetItems={getProductsViaLiveSearch}
        onSetAlertDetails={onSetAlertDetails}
      >
        <Button el="button" variant="primary" onClick={addSelectedProduct}>
          Add Product
        </Button>
      </DropdownWithSearch>
      <div className="overflow-auto mt-4 mb-2">
        <table className="table-collapse table-auto w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th>No. of Boxes</th>
              <th>Comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((data) => (
              <tr key={data.product.id}>
                <td>{data.product.name}</td>
                <td>
                  <input
                    type="number"
                    value={data.numberOfBoxes}
                    min={1}
                    className="w-20 border border-gray-200 py-1.5 px-2 rounded-sm bg-white"
                    placeholder="0"
                    onChange={(e) =>
                      onHandleBoxNumberChange(e, data.product.id)
                    }
                  />
                </td>
                <td>
                  <Form.TextArea
                    placeholder="Add comment, it's not necessary though"
                    value={data.comment}
                    rows={2}
                    onChange={(e) => onHandleCommentChange(e, data.product.id)}
                  />
                </td>
                <td>
                  <div className="flex items-center">
                    <button
                      className="cursor-pointer"
                      title="Remove item"
                      onClick={() => onRemoveItem(data.product.id)}
                    >
                      <LuTrash2 className="text-2xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!supplies.length && (
              <tr>
                <td colSpan={4}>
                  <p className="text-center">No products added at the moment</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
}
