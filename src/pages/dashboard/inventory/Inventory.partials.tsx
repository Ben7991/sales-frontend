import { ProductCard } from "@/components/molecules/product-card/ProductCard";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { formatAmount } from "@/utils/helpers.utils";
import type { InventoryDataTableProps } from "./Inventory.types";
import { Pill } from "@/components/atoms/pill/Pill";
import { FiEye } from "react-icons/fi";

export function InventoryDataTable({
  stockState,
  pathname,
  onNavigate,
}: InventoryDataTableProps): React.JSX.Element {
  return (
    <DataTable
      count={stockState.count}
      columnHeadings={[
        "Product",
        "Supplier",
        "Unit Price(retail)",
        "Box No.",
        "Total Pieces",
        "Status",
        "",
      ]}
    >
      {stockState.data.map((item) => (
        <tr key={item.id}>
          <td>
            <ProductCard
              name={item.product.name}
              imagePath={item.product.imagePath}
            />
          </td>
          <td>{item.supplier.name}</td>
          <td>&#8373; {formatAmount(+item.retailUnitPrice)}</td>
          <td>{item.numberOfBoxes}</td>
          <td>{item.totalPieces}</td>
          <td>
            <Pill
              text={item.status}
              variant={
                item.status === "IN_STOCK"
                  ? "success"
                  : item.status === "LOW_STOCK"
                    ? "secondary"
                    : "danger"
              }
            />
          </td>
          <td>
            <DataTable.Action
              className="hover:bg-gray-100 w-fit!"
              onClick={() => onNavigate(`${pathname}?action=view-details`)}
            >
              <FiEye className="text-xl" />
              <span>View</span>
            </DataTable.Action>
          </td>
        </tr>
      ))}
      {!stockState.data.length && (
        <tr>
          <td colSpan={7}>
            <p className="text-center">
              No product stocks available at the moment
            </p>
          </td>
        </tr>
      )}
    </DataTable>
  );
}
