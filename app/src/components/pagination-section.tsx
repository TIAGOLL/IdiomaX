import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { PaginationItem, PaginationLink, PaginationContent, PaginationPrevious, PaginationNext, Pagination, PaginationEllipsis } from '@/components/ui/pagination';


export function PaginationSection({
    data,
}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || 1
    const perPage = searchParams.get('per_page') || 10
    const activeTab = searchParams.get('tab')

    useEffect(() => {
        if (activeTab == "all" && !searchParams.get('page') && !searchParams.get('per_page')) {
            setSearchParams((state) => {
                state.set("tab", "all");
                state.set("per_page", 10);
                state.set("page", 1);
                return state;
            });
        }
    }), [activeTab, currentPage, perPage, setSearchParams];

    const totalPosts = data?.length;

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / perPage); i++) {
        pageNumbers?.push(i);
    }

    const maxPageNum = 5
    const pageNumLimit = Math.floor(maxPageNum / 1.5);

    const activePages = pageNumbers.slice(
        Math.max(0, currentPage - 1 - pageNumLimit),
        Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
    );

    const handleNextPage = () => {
        if (currentPage < pageNumbers.length) {
            setSearchParams(state => {
                state.set('page', parseInt(currentPage) + 1)
                return state
            })
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setSearchParams(state => {
                state.set('page', parseInt(currentPage) - 1)
                return state
            })
        }
    };

    useEffect(() => {
        if (!currentPage) {
            setSearchParams(state => {
                state.set('page', 1)
                return state
            })
        }
        if (!perPage) {
            setSearchParams(state => {
                state.set('per_page', 10)
                return state
            })
        }
    }, [currentPage, perPage, searchParams, setSearchParams])

    const renderPages = () => {
        const renderedPages = activePages.map((page, idx) => (
            < PaginationItem
                key={idx}
                className={currentPage == page ? "rounded-md" : ""}
            >
                <PaginationLink isActive={searchParams.get('page') == page} onClick={() => setSearchParams((state) => {
                    state.set('page', page)
                    return state
                })} className="hover:cursor-pointer">
                    {page}
                </PaginationLink>
            </ PaginationItem>
        ));

        // Add ellipsis at the start if necessary
        if (activePages[0] > 1) {
            renderedPages.unshift(
                <PaginationEllipsis
                    key="ellipsis-start"
                    onClick={() => setSearchParams((state) => {
                        state.set('page', activePages[0] - 1)
                        return state
                    })}
                />
            );
        }

        // Add ellipsis at the end if necessary
        if (activePages[activePages.length - 1] < pageNumbers.length) {
            renderedPages.push(
                <PaginationEllipsis
                    key="ellipsis-end"
                    onClick={() => setSearchParams((state) => {
                        state.set('page', activePages[activePages.length - 1] + 1)
                        return state
                    })}
                />
            );
        }

        return renderedPages;
    };

    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={handlePrevPage} className="hover:cursor-pointer" />
                    </PaginationItem>
                    {renderPages()}
                    <PaginationItem>
                        <PaginationNext onClick={handleNextPage} className="hover:cursor-pointer" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
